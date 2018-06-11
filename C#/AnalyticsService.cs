using Newtonsoft.Json;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.AnalyticsEvents;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        readonly IDataProvider dataProvider;

        public AnalyticsService(IDataProvider dataProvider)
        {
            this.dataProvider = dataProvider;
        }

        public List<Analytic> GetAll()
        {
            List<Analytic> results = new List<Analytic>();

            dataProvider.ExecuteCmd(
                "Analytics_GetAll",
                inputParamMapper: null,
                singleRecordMapper: (reader, resultSetNumber) =>
                {
                    Analytic analytic = new Analytic();
                    analytic.Id = (int)reader["Id"];
                    analytic.Data = (string)reader["Data"];
                    analytic.DateCreated = (DateTime)reader["DateCreated"];
                    analytic.DateModified = (DateTime)reader["DateModified"];

                    results.Add(analytic);
                });
            return results;
        }


        public void Delete(AnalyticDeleteRequest deleteModel)
        {
            dataProvider.ExecuteNonQuery(
                "Analytics_Delete",
                inputParamMapper: param =>
                {
                    param.AddWithValue("@Id", deleteModel.Id);
                },
                returnParameters: null);
        }

        public void Update(AnalyticUpdateRequest updateModel)
        {
            dataProvider.ExecuteNonQuery(
                "Analytics_Update",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@Id", updateModel.Id);
                    parameters.AddWithValue("@Data", updateModel.Event);
                },
                returnParameters: null);
        }

        public void LogEvent(AnalyticsBase analyticsBase)
        {
            string jsonData = JsonConvert.SerializeObject(analyticsBase);
            dataProvider.ExecuteNonQuery(
                "Analytics_Create",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@Data", jsonData);
                },
                returnParameters: null);
        }

        public void Create(AnalyticCreateRequest model)
        {
            model.UserId = model.UserId ?? null;
            string jsonData = JsonConvert.SerializeObject(model);
            dataProvider.ExecuteNonQuery(
                "Analytics_Create",
                inputParamMapper: parameters =>
                {
                    parameters.AddWithValue("@Data", jsonData);
                },
                returnParameters: null);
        }
    }
}
