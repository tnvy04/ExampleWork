using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Responses;
using Sabio.Services;
using Sabio.Services.AnalyticsEvents;
using Sabio.Services.Interfaces;
using Sabio.Services.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sabio.Web.Controllers
{
    public class AnalyticsController : ApiController
    {
        readonly IAnalyticsService analyticsService;
        
        public AnalyticsController(IAnalyticsService analyticsService)
        {
            this.analyticsService = analyticsService;
        }

        [Route("api/analytics"), HttpGet]
        public HttpResponseMessage GetAll()
        {
            List<Analytic> analytics = analyticsService.GetAll();

            ItemsResponse<Analytic> itemsResponse = new ItemsResponse<Analytic>();
            itemsResponse.Items = analytics;

            return Request.CreateResponse(HttpStatusCode.OK, itemsResponse);
        }

        [Route("api/analytics/{id:int}"), HttpDelete]
        public HttpResponseMessage Delete(int id, AnalyticDeleteRequest deleteModel)
        {
            if (deleteModel == null)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.NotAcceptable,
                    "No data was sent to the server.");
            };

            if (deleteModel.Id != id)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.NotAcceptable,
                    "The Id on the URL and data body does not match.");
            };

            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    ModelState);
            };

            analyticsService.Delete(deleteModel);
            SuccessResponse successResponse = new SuccessResponse();

            return Request.CreateResponse(HttpStatusCode.OK, successResponse);
        }

        [Route("api/analytics/{id:int}"), HttpPut]
        public HttpResponseMessage Update(int id, AnalyticUpdateRequest updateModel)
        {
            if (updateModel == null)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.NotAcceptable,
                    "No data was sent to the server.");
            };

            if (updateModel.Id != id)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.NotAcceptable,
                    "The Id on the URL and data body does not match.");
            };

            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    ModelState);
            };

            analyticsService.Update(updateModel);
            SuccessResponse successResponse = new SuccessResponse();

            return Request.CreateResponse(HttpStatusCode.OK, successResponse);
        }

        [Route("api/analytics"), HttpPost]
        public HttpResponseMessage Create(AnalyticCreateRequest model)
        {
  
            if (model == null)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.NotAcceptable,
                    "No data was sent to the server.");
            };

            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    ModelState);
            };

            model.UserId = User.Identity.GetId().Value; 
            analyticsService.Create(model);
            return Request.CreateResponse(HttpStatusCode.Created, new SuccessResponse());


        }

    }
}
