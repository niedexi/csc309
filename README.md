*Submitting Late

# team33

### Link
[Heroku: https://csc309team33.herokuapp.com](https://csc309team33.herokuapp.com)

### Instructions: 
* The default login credential for user is:
    * email: user@user.com
    * password: password

    * This will lead you to the Posts page where you can view posts added by other users, ordered by most recent ones at the top.
* Once logged in, you can access your profile page (top right on the navigation bar)
    * This page contains:
        * User's name, date joined, country and language(s) spoken and a profile picture
        * As well as the user's status
    * Scrolling to the bottom, you will have access to followers and following.
        * Each of these buttons will redirect to the corresponding page. Where you can access those that follow you and those you follow.
    * You will also have access to the istant messaging at the bottom of the profile page.
        * once clicked, it wil re-direct you to the users. clicking on teh user will open up the corresponding chat where you can participate in messaging.
* Once logged in, you will also have access to the dashboard (top rigth on navigation bar)
    * Here you will be able to see other users informaion

## Admin:
* The admin panel is located at 'https://csc309team33.herokuapp.com/admin/', default login credential is:

    * Administration ID: admin
    * Password: admin
* Once on the admin page, you have access to all users who are currently using this web app. With admin priveledges, you will be able to send warnings to users or in Remove profile as a last resort

### Routes

* / (homepage)
* /login (user login)
* /register (user sign up)
* /profile (user profile)
* /dashboard (user dashboard)
* /profile/following (user following)
* /profile/followers (user followers)
* /chat (private messaging)
* /admin/login (admin login)
* /admin/dashboard (admin dashboard)
