const express = require("express");
const router = express.Router();
const axios = require("axios");
const { ObjectId } = require("mongodb");

const clientId = "vQhGP6gSiWaQnARoZSlw";
const accountId = "oaJeDeaUS_aOXvpoZbQ9Ag";
const clientSecret = "WPTvAUeCad0oa9H72GWl9MabncPWr7Cp";
const auth_token_url = "https://zoom.us/oauth/token";

const createMeeting = async (
  meetingData,
  schedulerEmail,
  participantEmails
) => {
  const authResponse = await axios.request({
    method: "post",
    maxBodyLength: Infinity,
    url: `${auth_token_url}?grant_type=account_credentials&account_id=${accountId}`,
    headers: {
      Authorization:
        "Basic dlFoR1A2Z1NpV2FRbkFSb1pTbHc6V1BUdkFVZUNhZDBvYTlINzJHV2w5TWFibmNQV3I3Q3A=",
      Cookie:
        "__cf_bm=5OONB.jSopsh7wMT7eiEG.xzricXGYd5vb_jye5vJOQ-1698759201-0-ARNm2CcYY2qXWEVSSaWF9z7Rg3eISPgR+TAXnJfI+PwmlvAfOoEAxvBO2IGbn7ZP4YisgVTmDSNcWNWGmDWuf20=; _zm_chtaid=5; _zm_ctaid=xp5rv_5bRJuzRhmrB_Zjzg.1698759201827.973c882cb9b0961310f9ab7d78db9c41; _zm_mtk_guid=b6ad9e0e534f4ae181b8fe8e0ff37f42; _zm_page_auth=us04_c_9ClKalyKRR6NpGc-nXB2cw; _zm_ssid=aw1_c_yU756yycR6epksZm3450hQ; cred=4CF67A73A0E7ED2905D0FE54E1D1F8CF",
    },
  });

  if (authResponse.status !== 200) {
    console.log("Unable to get access token");
    return;
  }

  const access_token = authResponse.data.access_token;

  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };
  try {
    meetingData.settings = {
      host_video: true,
      participant_video: true,
      join_before_host: false,
    };

    // Set the scheduler's email
    meetingData.settings.host_email = schedulerEmail;
    // Set the participants' emails
    meetingData.settings.participant_email = participantEmails;

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingData,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

router.post("/create-student", async (req, res, next) => {
  try {
    const { StudentsCollection } = global;
    const { teacherEmail, studentEmail, time } = req.body;
    const meetingData = {
      topic: "Class Meeting",
      type: 2, // Scheduled meeting
      start_time: new Date(time).toISOString(),
      duration: 60, // Meeting duration in minutes
    };
    const zoomMeetingDetails = await createMeeting(
      meetingData,
      teacherEmail,
      studentEmail
    );
    const { id, join_url, start_time } = zoomMeetingDetails;

    // Insert the meeting details into your database
    const meetingDocument = {
      teacherEmail,
      studentEmail,
      time: start_time,
      zoomMeetingId: id,
      zoomLink: join_url,
    };

    const result = await StudentsCollection.insertOne(meetingDocument);
    console.log(JSON.stringify(result));
    res.json(result.ops[0]);
  } catch (error) {
    console.error("Zoom API Error:", error);
    next(error);
  }
});

// READ Students
router.get("/", async (req, res, next) => {
  const { StudentsCollection } = global;

  await StudentsCollection.find()
    .toArray()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      next(error);
    });
});

// UPDATE student
router
  .route("/update-student/:id")
  // Get Single Student
  .get(async (req, res, next) => {
    const { StudentsCollection } = global;

    await StudentsCollection.findOne({ _id: req.params.id })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        next(error);
      });
  })

  // Update Student Data
  .put(async (req, res, next) => {
    const { StudentsCollection } = global;

    await StudentsCollection.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    )
      .then((data) => {
        res.json(data);
        console.log("Student updated successfully !");
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  });

// Delete Student
router.delete("/delete-student/:id", async (req, res, next) => {
  const { StudentsCollection } = global;

  await StudentsCollection.deleteOne({ _id: ObjectId(req.params.id) })
    .then((data) => {
      res.status(200).json({ msg: data });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
