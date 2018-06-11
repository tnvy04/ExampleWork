using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.AnalyticsEvents
{
    public class LogInAction: AnalyticsBase
    {

        public LogInAction(
            int UserId,
            string LanguageCode,
            string URL
            )
        {
            this.UserId = UserId;
            this.LanguageCode = LanguageCode;
            this.Url = Url;
        }
    }
}
