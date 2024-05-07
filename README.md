# CS546_SemesterProject
Private Github Repo for the Source Code and File(s) for CS546-A Semester Project


<h3>Collaborator(s):</h3> <br>
<ul>
  <li>Muhammad Owais Imran</li>
  <li>Jasmine Cairns</li>
  <li>Mohit Singh</li>
  <li>Jonathan Memoli</li>
  <li>Stephen Pachucki</li>
</ul>
<hr>
<h2><a href="https://docs.google.com/document/d/1HDqA_3iJwkbXRNdzlV79PGtjue-KHMKJK6f2wBXk1tM/edit?usp=sharing">Project Proposal</a></h2>
<h2><a href="https://docs.google.com/document/d/1lgALuOU0bh_t1MZgJJTC4XTiQaZECzf780qho0XnN_4/edit?usp=sharing">Project Database Proposal</a></h2>

## Running the Application
Unzip the folder and make sure to be in the correct directory: 
```bash
cd CS546_SemesterProject
```
Install dependencies and then run the program:
```bash
npm install
npm start
```
Finally, make sure that the .env file is correct and in the root directory. 
And that's it! Our database is hosted on the cloud so there is no need for seeding. <br />
The application can be found at [http://localhost:3000](http://localhost:3000/)

## Navigation: Routes
After navigating to [http://localhost:3000](http://localhost:3000/), the website will redirect to [http://localhost:3000/product](http://localhost:3000/product),
which displays all the current active product listings in the databse. All other routes will require an account to access. 
## User Routes
### /login
Renders a login form where the user can enter a username and password to login if they have an account.
### /register
Renders a register page where users can create an account for the first time. Users will be prompted to set their username, password, and other information. The option to upload a profile picture is also provided. 
### /logout
Logs out the user, redirects to the login page. 
### /profile
Renders a profile page where the logged-in user can see their account info. This page also provides links to the logged in user's current products. 
### /userInfo/:id
Renders a page where the user can view the profile info of other users. Provided is a form to write a complaint about this user.
### /my-products
Shows a list of products that the user has created. Products that have not been completed will be highlighted. Users will hav the option to update, delete, and view the bids on their product. 
## Product Routes
### /product/
Home page of the application, displays all the active product listings. Does not require an account to view.
### /product/serach
Shows search results after typing the name of a product in the search bar.
### /product/:id
Shows additional info about the product, as well as information about the user that made the product listing. Here, users can make bids on the product, add comments, submit a complaint about the listing, or leave a review on the listing. 
### /product/new
Renders a form where the user can create a new product. All informatin about the product must be provided in order for the listing to become active. 
### /product/new/:id
If a user has not finished creating a product, they can click on the "Continue Registration" button found on `/my-products`. Here the user can finish entering the product info. 
## Bid Routes
### /bid/:id
Available from the `/my-products` route, this allows the user to view the current bids on their listing, as well as the bidder's contact information to complete the purchase. 
## Admin Routes
These routs are only available to admin users. The user can only log in and view these routes with the admin username and password, found in the `.env` file. 
### /admin/login
Login page for admins only. 
### /admin
Redirect page after logging in, shows the navbar with 4 additional links: View All Seller Complaints, View All Product Complaints, View All Products, and View All Users.
### /admin/view-all-complaints
Redirects to a table that shows the current complaints against all the sellers. This page has links for the admint to update the status of the complaints (Active, Pending, Resolved, Discarded), as well as view the profile of the user the complaint is against. 
### /admin/view-all-complaints-product
Similar to `/admin/view-all-complaints` but shows complaints for a specific product. 
### /admin/view-all-products
Allows the admin to view all products, both active and inactive. The Admin has the option to make any of the products active or inactive using the enable and disable buttons. 
### /admin/view-all-users
Allows the admin to view all users, both active and inactive. Similar to `/admin/view-all-products`, the admin can enable and disable specific users using the enable and disable buttons. 

