using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.AnalyticsEvents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IAnalyticsService
    {
        List<Analytic> GetAll();
        void Delete(AnalyticDeleteRequest deleteModel);
        void Update(AnalyticUpdateRequest updateModel);
        void LogEvent(AnalyticsBase analyticsBase);
        void Create(AnalyticCreateRequest jsonModel);
    }
}
