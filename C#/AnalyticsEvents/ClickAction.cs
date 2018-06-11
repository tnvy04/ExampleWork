using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.AnalyticsEvents
{
    public class ClickAction : AnalyticsBase
    {
        public string Action = "Click";
        public string ExtraData { get; set; }

        public ClickAction(string URL, int? UserId = null, string LanguageCode = null, string ExtraData = null)
        {
            this.UserId = UserId;
            this.LanguageCode = LanguageCode;
            this.Url = Url;
            this.ExtraData = ExtraData;
        }
        
    }
}
