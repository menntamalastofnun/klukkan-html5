


// Load the xml file using ajax 
$.ajax({
    type: "GET",
    url: "times1.xml",
    dataType: "xml",
    success: function (xml) {

        // Parse the xml file and get data
        var xmlDoc = $.parseXML(xml);
        var $xml = $(xmlDoc);
        console.log(xmlDoc);
		console.log($xml);
		/* $xml.find('category[name="My t"] logo').each(function () {
            $("#news-container").append($(this).text() + "<br />");
        }); */
    }
});