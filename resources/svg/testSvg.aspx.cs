using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace flareJ.flareJ.Java.WebRoot.JsLibrary.flareJ.resources.svg
{
    public partial class testSvg : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            this.Page.Response.ContentType = "image/svg+xml";
        }
    }
}