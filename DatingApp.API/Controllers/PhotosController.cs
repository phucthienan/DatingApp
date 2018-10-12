using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("/api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly IMapper _mapper;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository datingRepository,
            IOptions<CloudinarySettings> cloudinaryConfig, IMapper mapper)
        {
            _datingRepository = datingRepository;
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;

            var account = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photo = await _datingRepository.GetPhoto(id);
            var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);

            return Ok(photoToReturn);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId,
            [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var user = await _datingRepository.GetUser(userId);
            var file = photoForCreationDto.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                            .Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if (!user.Photos.Any(p => p.IsMain))
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _datingRepository.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn); ;
            }

            return BadRequest("Could not add the photo");
        }

        [HttpPost("{id}/set-main")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var user = await _datingRepository.GetUser(userId);

            if (!user.Photos.Any(p => p.Id == id))
            {
                return Unauthorized();
            }

            var photo = await _datingRepository.GetPhoto(id);

            if (photo.IsMain)
            {
                return BadRequest("This is already the main photo");
            }

            var currentMainPhoto = await _datingRepository.GetMainPhotoForUser(userId);

            currentMainPhoto.IsMain = false;
            photo.IsMain = true;

            if (await _datingRepository.SaveAll())
            {
                return NoContent();
            }

            return BadRequest("Could not set this photo to main");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var user = await _datingRepository.GetUser(userId);

            if (!user.Photos.Any(p => p.Id == id))
            {
                return Unauthorized();
            }

            var photo = await _datingRepository.GetPhoto(id);

            if (photo.IsMain)
            {
                return BadRequest("Could not delete main photo");
            }

            if (photo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                {
                    _datingRepository.Delete(photo);
                }
            }
            else
            {
                _datingRepository.Delete(photo);
            }

            if (await _datingRepository.SaveAll())
            {
                return Ok();
            }

            return BadRequest("Delete photo failed");
        }
    }
}
