using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.AnalyticsEvents
{
    public class PlusAction : AnalyticsBase
    {
        public string Action = "Plus";

        [Required]
        public int AthleteId { get; set; }


        public PlusAction(
            int AthleteId,
            int UserId, 
            string LanguageCode, 
            string URL)
        {
            this.AthleteId = AthleteId;
            this.UserId = UserId;
            this.LanguageCode = LanguageCode;
            this.Url = Url;
        }
    }
}
