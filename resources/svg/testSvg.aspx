<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="testSvg.aspx.cs" Inherits="flareJ.flareJ.Java.WebRoot.JsLibrary.flareJ.resources.svg.testSvg" %>

<%--<%
Response.AddHeader("Content-Type","image/svg-xml");
int w,h,r;
w=Int32.Parse(Request["w"]);
h=Int32.Parse(Request["h"]);
r=Int32.Parse(Request["r"]);

Response.Write ("<svg>");
Response.Write ("<rect x='10' y='10' width='"+ w +"' height='"+h+"' stroke='red' fill='blue' />");
Response.Write ("<circle cx='100' cy='40' r='"+ r +"' stroke='red' fill='blue' />");
Response.Write (" </svg>");
%>--%>

<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

<svg width="100%" height="100%" version="1.1"
xmlns="http://www.w3.org/2000/svg">

<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="100%">
<stop offset="0%" style="stop-color:#ffffff;stop-opacity:1"/>
<stop offset="100%" style="stop-color:#70C4F2;stop-opacity:1"/>
</linearGradient>
</defs>

<rect x="0" y="0" rx="4" ry="4" width="100%" height="100%"
style="fill:url(#bg)"/>

</svg>