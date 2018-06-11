using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.AnalyticsEvents
{
    public class FistBumpAction : AnalyticsBase
    {
        public string Action = "Fist Bump";
        
        [Required]
        public int RecipientId { get; set; }

        [Required]
        // Was this a request?
        public bool Request { get; set;  } 

        // 0: no response
        // 1: accepted
        // 2: denied
        [Range(0,2)]
        public int Response { get; set; }


        public FistBumpAction(
            int UserId, 
            int RecipientId, 
            bool Request, 
            string LanguageCode, 
            string URL, 
            int Response)
        {
            this.UserId = UserId;
            this.RecipientId = RecipientId;
            this.Request = Request;
            this.LanguageCode = LanguageCode;
            this.Url = Url;
            this.Response = Response;
        }
    }
}
