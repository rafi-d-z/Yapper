# Yapper

https://yapper-alpha.vercel.app

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [FAQs](#faqs)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Acknowledgments](#acknowledgments)


## Introduction
Yapper is a versatile social media platform catering to a wide range of users, from individuals expressing their creativity to corporate entities connecting with their audience. By harnessing the power of modern web technology, Yapper offers an intuitive and responsive user experience. Explore the various features and make the most of your Yapper experience!

## Features
### 1. Dynamic Feed
Yapper's feed is a dynamic space where users can explore a rich variety of content. The feed supports real-time updates, ensuring users stay connected with the latest posts, comments, and likes. A sophisticated algorithm ensures that the most relevant and engaging content surfaces to the top, creating a personalized experience for each user.

### 2. Interactive Engagement
#### - Likes, Comments, and Shares
Interact with posts through a variety of engagement options. Express your appreciation with likes, join the conversation through comments, and share interesting posts with your followers.

#### - Multimedia Comments
Enhance your interactions by adding multimedia elements to your comments. Share images or videos to provide a more immersive and expressive commentary on posts.

### 2. User Profiles
Personalization is key at Yapper. User profiles are not just static displays but dynamic hubs that reflect a user's personality. Avatars, subscriber counts, and total likes are just the beginning. Users can customize their profiles to make a unique statement within the community.

  #### - Corporate User Features
  Corporate users can leverage Yapper as a platform for job and ad postings. This feature facilitates seamless communication between companies and potential candidates or customers.

  #### - Trendy User Recognition
  Yapper recognizes a subset of users known as "Trendy Users." These are ordinary users who have garnered significant attention—subscribed by more than 10 users, received $100 in tips, and have a post engagement (_See FAQs for more details_) greater than 10. To be considered trendy, users must also author at least 2 trendy messages.

  #### - Surfer
  Surfers on Yapper have limited interaction capabilities. They can view and search messages but are restricted from posting content. Surfing users can report or complain about content, contributing to community moderation.

### 3. Commenting System
Yapper's robust commenting system allows users to express their thoughts and engage in meaningful discussions. Comments are not just text; they're a way for users to connect and build relationships. The system supports multimedia comments, enabling users to share images and videos alongside their text contributions.

### 4. Search Functionality
Looking for specific content? Yapper's advanced search functionality lets users find posts based on keywords, hashtags, and content types. Users can filter content to view only text-based posts, images, or videos, making it easy to discover the content that matters most to them.

### 5. Profile Settings
Yapper puts control in the hands of its users. The platform provides extensive profile settings, allowing users to customize their avatars, update personal details, and manage privacy settings. Yapper is all about empowering users to curate their digital identity.

### 6. Authentication and Security
Yapper takes user security seriously. The authentication system is built on Supabase, ensuring a secure and reliable user experience. Passwords are encrypted, and user data is protected.

### 7. Responsive Design
Yapper is accessible from a variety of devices, thanks to its responsive design. Whether users are accessing the platform from a desktop, tablet, or smartphone, Yapper ensures a consistent and enjoyable experience.

### 7. Tipping
Yapper includes a tipping feature, allowing users to show appreciation for content they find valuable. This feature enhances the sense of community and supports content creators within the platform.


## Getting Started

### Prerequisites
Before diving into Yapper, ensure you have the following prerequisites installed:

- Node.js
- npm or yarn
- Supabase account

### Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies by running **npm install** on your terminal
4. Set up Supabase:
      1. Create a Supabase project and obtain the API key.
      2. Update the supabaseClient.js file with your Supabase URL and API key.
5. run the application by running **npm start** on your terminal

**Now you're ready to explore Yapper!**

## Usage
### Getting Started
To get started with Yapper, follow these simple steps:
- If you are a new user, head to the Yapper sign up page to create your account.
- Fill in the required information, choose a unique username, and set a secure password.

### 2. Exploring the Feed
Once logged in, you'll land on the dynamic feed. Explore a variety of content shared by users, including text posts, images, and videos.

### 3. Engaging with Content
Like, comment, and share posts that catch your interest. Yapper encourages active engagement and meaningful interactions within the community.

### 4. Customizing Your Profile
Personalize your profile by uploading a unique avatar. Manage privacy settings to control who can view your content and interact with you.

### 5. Job and Ad Postings (Corporate Users)
If you are a corporate user, take advantage of Yapper's platform for job and ad postings. Connect with potential candidates or customers seamlessly.

### 6. Becoming a Trendy User
Gain recognition as a "Trendy User" by accumulating more than 10 subscribers, receiving $100 in tips, having a post engagement (_See FAQs for more info_) greater than 10, and creating at least 2 trendy messages.

### 7. Expressing Appreciation with Tips
Use the tipping feature to show appreciation for content you find valuable. Support fellow users and content creators within the Yapper community.

### 8. Surfer
If you prefer to explore content without actively participating, you can adopt the role of a "Surfer." Surfers have limited interaction capabilities, focused on viewing and searching messages.

## FAQs

- Q: Can users share multimedia content in comments?

- A: Yes, Yapper's commenting system supports multimedia content, allowing users to share images and videos alongside text comments.

- Q: How is post engagement calculated?

- A: At Yapper, we calculate post engagement by subtracting the number of likes by the number of dislikes, having a post engagement greater than 10 will get you closer to becoming a Trendy User!

## Folder Structure
The project follows a structured organization:
- components
- pages
- utils

## Technologies Used
Yapper utilizes cutting-edge technologies to deliver a seamless user experience:

- **React:** A powerful JavaScript library for building user interfaces.
- **Ant Design:** A React UI library with a set of high-quality components.
- **Supabase:** An open-source alternative to Firebase, providing real-time database capabilities.

## License
This project is licensed under the MIT License.

## Acknowledgments
A special thank you to the talented developers who contributed to the Yapper project:
[Johan](https://github.com/JohanDelao) , [Mazen](https://github.com/Mazen-Z) , [Henry](https://github.com/Henrysua12) , [Mansij](https://github.com/MansijMishra) , [Rafid](https://github.com/rafi-d-z)

And special thanks to the developers and communities behind React, Ant Design, and Supabase for creating tools that empower developers to build innovative applications.


