using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository datingRepository, IMapper mapper)
        {
            _datingRepository = datingRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery] MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            messageParams.UserId = userId;

            var messages = await _datingRepository.GetMessagesForUser(messageParams);

            var messagesToReturn = _mapper.Map<IEnumerable<MessageForReturnDto>>(messages);

            Response.AddPagination(messages.CurrentPage, messages.PageSize,
                messages.TotalCount, messages.TotalPages);

            return Ok(messagesToReturn);
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var message = await _datingRepository.GetMessage(id);

            if (message == null)
            {
                return NotFound();
            }

            return Ok(message);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var messages = await _datingRepository.GetMessageThread(userId, recipientId);
            var messageTheard = _mapper.Map<IEnumerable<MessageForReturnDto>>(messages);

            return Ok(messageTheard);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            var sender = await _datingRepository.GetUser(userId);

            if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            messageForCreationDto.SenderId = userId;

            var recipient = await _datingRepository.GetUser(messageForCreationDto.RecipientId);

            if (recipient == null)
            {
                return BadRequest("Could not find recipient user");
            }

            var message = _mapper.Map<Message>(messageForCreationDto);
            _datingRepository.Add(message);

            if (await _datingRepository.SaveAll())
            {
                var messageToReturn = _mapper.Map<MessageForReturnDto>(message);
                return CreatedAtRoute("GetMessage", new { id = message.Id }, messageToReturn);
            }

            throw new Exception("Create message failed");
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var message = await _datingRepository.GetMessage(id);

            if (message.SenderId == userId)
            {
                message.SenderDeleted = true;
            }

            if (message.RecipientId == userId)
            {
                message.RecipientDeleted = true;
            }

            if (message.SenderDeleted && message.RecipientDeleted)
            {
                _datingRepository.Delete(message);
            }

            if (await _datingRepository.SaveAll())
            {
                return NoContent();
            }

            throw new Exception("Delete message failed");
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var message = await _datingRepository.GetMessage(id);

            if (message.RecipientId != userId)
            {
                return Unauthorized();
            }

            if (message.RecipientId == userId)
            {
                message.IsRead = true;
                message.DateRead = DateTime.Now;
            }

            if (await _datingRepository.SaveAll())
            {
                return NoContent();
            }

            throw new Exception("Mark message as read failed");
        }
    }
}
