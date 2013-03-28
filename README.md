# *On the Rocks* Craft demo site

This repo contains all of the templates, front-end resources, and a MySQL DB dump for *On the Rocks*, a demo site built with [Craft](http://buildwithcraft.com).

It has the following features:

* Multiple [sections](http://docs.buildwithcraft.com/overview/sections.html) (“Cocktails”, “Ingredients”, and “Blog”)
* A local asset source (“Drinks”)
* A Links field pointing to the Drinks asset source, used by the Cocktails and Ingredients sections
* A Links field pointing to entries in the Ingredients section, used by the Cocktails section
* A [global set](http://docs.buildwithcraft.com/overview/globals.html) called “Homepage” for editing the homepage fields
* A [global set](http://docs.buildwithcraft.com/overview/globals.html) called “Globals” with a “Meta Description” field for editing the `<meta name="description">` tag’s `content` attribute
* A single [layout template](https://github.com/pixelandtonic/ontherocks/blob/master/craft/templates/_layout.html) which all other site templates extend
* Front-end user [registration](https://github.com/pixelandtonic/ontherocks/blob/master/craft/templates/accounts/register.html), [login](https://github.com/pixelandtonic/ontherocks/blob/master/craft/templates/accounts/login.html), and [password resetting](https://github.com/pixelandtonic/ontherocks/blob/master/craft/templates/accounts/forgotpassword.html)
* A custom [404 template](https://github.com/pixelandtonic/ontherocks/blob/master/craft/templates/404.html)


## Packages in Use

This site makes use of the [Publish Pro](http://docs.buildwithcraft.com/packages/publishpro.html) and [Users](http://docs.buildwithcraft.com/packages/users.html) packages.

As long as you’re running the site from http://ontherocks.dev, you will not be notified that you haven’t purchased these packages. You will even have the option to install the other three packages, if you want to play around with them.


## Installation

To get *On the Rocks* running locally, follow these instructions:

1. Download/clone the repo on your computer
2. Set the permissions on craft/storage/ to 777
3. Set the permissions on craft/config/ to 666
4. Download the latest version of Craft from [buildwithcraft.com](http://buildwithcraft.com)
5. Move the craft/app/ folder from Craft.zip into ontherocks/craft/
6. Create a new MySQL database called “ontherocks”
7. Import SQL/ontherocks.sql into your new database
8. Fill in the proper MySQL credentials in craft/config/db.php
9. Create a new virtual host with the hostname “ontherocks.dev” that points to the public/ folder

Now you should be able to point your web browser to http://ontherocks.dev/admin. You should either see a Craft login screen, or a prompt telling you that some database updates need to be run. If it’s the latter, just click “Finish up”.

Now point your browser at http://ontherocks.dev. You should see the *On the Rocks* homepage.


## Logging in

The Craft CP is located at http://ontherocks.dev/admin. You can log in with the following credentials:

**Username:** admin
**Password:** password
