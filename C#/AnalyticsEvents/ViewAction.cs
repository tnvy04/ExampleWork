using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.AnalyticsEvents
{
    public class ViewAction : AnalyticsBase
    {
        public string Action = "View";
        public int? Owner_UserId { get; set; }
        public string Category { get; set; }
    }
}
