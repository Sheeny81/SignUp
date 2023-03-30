const express = require("express");
const client = require("@mailchimp/mailchimp_marketing");
const app = express();
const port = 3000;

var mailChimpKey = config.MAIL_CHIMP_KEY;
var mailChimpListID = config.MAIL_CHIMP_LIST_ID;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());


app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res){

    
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.eMail;
    const data = {
        members: [
            {
                email_address : email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ]
    };

    const jsonData = JSON.stringify(data);

    client.setConfig({
        apiKey: mailChimpKey,
        server: "us14",
    });

    const run = async () => {
        const response = await client.lists.batchListMembers(mailChimpListID,
            jsonData
        );
        var errorCount = response.error_count;
        console.log("Error Count", response.error_count);
        

        console.log("HTTP Status code: ", res.statusCode);
        if (res.statusCode == 200) {
            if (errorCount == 0) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            };
        };
    }
    run();
});

app.post("/success", (req, res)=>{
    res.redirect("https://www.google.com");
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})


app.listen(process.env.PORT || port, ()=>{
    console.log(`Port listened ${port}`); 
});
