using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.AnalyticsEvents
{
    public class StarAction : AnalyticsBase
    {
        public string Action = "Star";
        public int OwnerId { get; set; }

        public StarAction(
            int UserId,
            int OwnerId,
            string LanguageCode, 
            string URL)
        {
            this.UserId = UserId;
            this.OwnerId = OwnerId;
            this.LanguageCode = LanguageCode;
            this.Url = Url;
        }
    }
}
