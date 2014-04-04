# *On the Rocks* Craft demo site

This repo contains all of the templates, front-end resources, and a MySQL DB dump for *On the Rocks*, a demo site built with [Craft](http://buildwithcraft.com).

It has the following features:

* Multiple [sections](http://docs.buildwithcraft.com/diving-in/sections.html) (“Cocktails”, “Ingredients”, and “Blog”)
* A local asset source (“Drinks”)
* A Links field pointing to the Drinks asset source, used by the Cocktails and Ingredients sections
* A Links field pointing to entries in the Ingredients section, used by the Cocktails section
* A [global set](http://docs.buildwithcraft.com/diving-in/globals.html) called “Homepage” for editing the homepage fields
* A [global set](http://docs.buildwithcraft.com/diving-in/globals.html) called “Globals” with a “Meta Description” field for editing the `<meta name="description">` tag’s `content` attribute
* A single [layout template](https://github.com/pixelandtonic/ontherocks/blob/master/craft/templates/_layout.html) which all other site templates extend
* Front-end user [registration](https://github.com/pixelandtonic/ontherocks/blob/master/craft/templates/accounts/register.html), [login](https://github.com/pixelandtonic/ontherocks/blob/master/craft/templates/accounts/login.html), and [password resetting](https://github.com/pixelandtonic/ontherocks/blob/master/craft/templates/accounts/forgotpassword.html)
* A custom [404 template](https://github.com/pixelandtonic/ontherocks/blob/master/craft/templates/404.html)

## Editions

The site is running the Pro Edition of Craft and as long as you’re running the site from http://ontherocks.dev, you can use all of the features if provides for free for an unlimited time.  You will even have the option to install the Client or Personal Editions, if you want to play around with them.


## Installation

To get *On the Rocks* running locally, follow these instructions:

1. Download/clone the repo on your computer

		$ git clone https://github.com/pixelandtonic/ontherocks.git

2. Set the permissions on craft/storage/ to 777

		$ cd ontherocks
		$ chmod 777 craft/storage/

3. Set the permissions on craft/config/ to 744, 774, or 777 depending on the relationship between the user that Apache/PHP is running as and the user who owns the craft/config folder. (See the [Craft installation docs](http://docs.buildwithcraft.com/installing/installing.html#preparing-to-install) for details.)

		$ chmod 774 craft/config

4. Download the latest version of Craft from [buildwithcraft.com](http://buildwithcraft.com)

		$ curl -L http://download.buildwithcraft.com/craft/2.0/2.0.2525/Craft-2.0.2525.zip -o /tmp/Craft.zip

		*Note:* In the above example, replace the version (2.0) and the build (2525) numbers with the latest from http://buildwithcraft.com/updates

		$ unzip /tmp/Craft.zip -d BaseCraft

5. Move the craft/app/ folder from Craft.zip into ontherocks/craft/

		$ cp -R BaseCraft/craft/app craft/app
		$ rm -R BaseCraft && rm /tmp/Craft.zip

6. Create a new MySQL database called “ontherocks”
		
		$ mysql -u root -p
		Enter password:
		mysql>

	```sql
	CREATE DATABASE ontherocks CHARACTER SET utf8 COLLATE utf8_unicode_ci;
	GRANT ALL ON ontherocks.* TO 'rocks_user'@'localhost' identified by 'letmein';
	FLUSH PRIVILEGES;
	USE ontherocks;
	```

	This can also be done via a management tool like phpMyAdmin.


7. Import SQL/ontherocks.sql into your new database

	```sql
	mysql>source SQL/ontherocks.sql
	```

8. Fill in the proper MySQL credentials in craft/config/db.php (from step 6)
9. Create a new virtual host with the hostname “ontherocks.dev” that points to the public/ folder
10. Edit your hosts file to resolve ontherocks.dev to 127.0.0.1, if necessary

Now you should be able to point your web browser to http://ontherocks.dev/admin. You should either see a Craft login screen, or a prompt telling you that some database updates need to be run. If it’s the latter, just click “Finish up”.

Now point your browser at http://ontherocks.dev. You should see the *On the Rocks* homepage.


## Logging in

The Craft CP is located at http://ontherocks.dev/admin. You can log in with the following credentials:

**Username:** admin
**Password:** password
