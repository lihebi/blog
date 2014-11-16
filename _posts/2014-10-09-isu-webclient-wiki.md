---
title: ISU WebClient Wiki
location: Ames
time: 16:25:21
---

# ISU Face Recognition WebClient
by Evil Genius

# Demo

[OnlineDemo](http://webclient.lihebi.com)

# RESTful API
This is our ideal API for network traffic. I try to obey RESTful API strictly.

| URL	                | METHOD |	Body(payload)	                      | Description |
| ----               | ----  | ---                                 | --- |
| /users              | GET    | `None`                               | Get all user info |
| /users/:userId      |	GET    | `None`                                 |	Get user info by id |
| /users	            | POST   | `{username:"user",email:"xxx",...}`    |	Create A user |
| /users/:userId      | PUT    | `{username: "user2", email: "yyy", ..}`| Update a user |
| /users/:userId      | DELETE |   `None`                                     | Delete a user |
| /students/:groupId/:classId | GET | `None` | Get student information from groupId and classId |

The same for groups, instructors, and courses.

### Some drawbacks of the API that Attendence database designed

The Database is designed fantastically.
I apologize for that I didn't connect you before,
I just set up a server for the test of my client app.

But I would love to give you my opinion about the API you designed.

Here's your API:

* `POST /jsonresponse/get_user_info/`: Get user infomation
* `POST /jsonresponse/get_instructor_info` with data `{instructor_id: 8}`: Get instructor infomation
* `POST /jsonresponse/get_instructor_groups` with data `{instructor_id: 8}`: Get instructor groups
* `POST /jsonresponse/get_group_classes/` with data `{group_id: 1}`: Get Group Classes
* `POST /jsonresponse/get_class_attendance/` with data `{group_id: 1, class_id: 1}`: Get class attendance
* `POST /jsonresponse/get_group_students/` with data `{group_id: 2}`: Get group students
* `POST /jsonresponse/get_student_info/` with data `{group_id: 1, student_id: 1}`: Get group students
* `POST /jsonresponse/get_student_registered_courses/` with data `{student_id: 1}`: Get registered courses from student

**Drawbacks**:

* `POST` should be used if and only if we want to create a new record. But you use it for all API.
* Why bother to use so long and weird url? `GET /users/:userId` can tell you anything.
* Your API send `ID` as data along with your `POST` request, but as the point above, just include the id in a `GET` request.

**My Design**

If I were you, I would design them like this:

For user management:

* `GET /users`: Get All Users information
* `GET /users/:userId`: Get user by userId
* `POST /users` with data `{username: "xxx", email: "xxx", ...}`: create new user
* `PUT /users/:userId` with data `{username: "xxx", email: "xxx", ...}`: update user
* `DELETE /users/:userId`: delete user

Same for instructor management.

* `GET /instructors`: Get All Instructors' Information
* `GET /instructors/:instructorId`: Get instructor information by ID
* `POST ...`
* `PUT ...`
* `DELETE ...`

Actually I didn't get what the `groups` is used for.

To get info upon several parameters, you can do this:

* `GET /students/:groupId/:classId`: Get student information from groupId and classId

See more [here](https://parse.com/docs/rest)

# CORS
Since we are going to make http request directly from browser,
it is important to notice that we need some technique to
beat the cross-domain policy set by browsers.

I plan to use CORS: Cross-origin resource sharing.
I have added the header

```
'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
```

in my http request.


### What the server should do to let CORS function work?
When you receive request from me,
you need to include an extra header in http header in the response.

```
Access-Control-Allow-Origin: *
```

If you don't include the header in the response, I will never get the response.
It will be blocked by the browsers.

See more [here][url]
[url]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS

# Session
We need to maintain sessions.

One way we can do this is to use cookies.
Whenever a new session connects to the server,
the server should set a random string as cookie to the client.
The server authenticate user and maintain the user status.

To ease your work, I plan to do authentication in front-end.
This is not so secure actually, but it's enough for the functionality.

What I need from you is when I issue `/users/:userId`,
the server should return json that contains both username and password,
I will authenticate the user and maintain the status on front-end

# Contact
There seems to be a lot to discuss.
If words here don't make sense, please <a href="sendto: hebi@iastate.edu">send me email</a>.
