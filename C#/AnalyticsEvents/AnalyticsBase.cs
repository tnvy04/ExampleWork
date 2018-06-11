
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using Sabio.Services.Security;
using System.Threading.Tasks;

namespace Sabio.Services.AnalyticsEvents
{
    public abstract class AnalyticsBase
    {
        [Required]
        public int? UserId { get; set; }
        public string LanguageCode { get; set; } = null;
        [Required]
        public string Url { get; set; }
        public string ToJson()
        {
            return (JsonConvert.SerializeObject(this, Formatting.Indented));
        }

        /*
        public AnalyticsBase(int UserId, string LanguageCode, int Category, string URL){
            this.UserId = UserId;
            this.LanguageCode = LanguageCode;
            this.Category = Category;
            this.Url = Url;
        }
        */
    }
}
