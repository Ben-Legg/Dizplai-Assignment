# Dizplai-Assignment
This project was a technical test for the Dizplai application process. I was tasked with making a basic two page web app that can allow users to vote on a poll and view the poll results.

The server is a Node.js API, built using the Express framework, and the front-end uses EJS to generate dynamic HTML. As I had minimal expereience developing back-end code, this project introduced me to working with RESTful APIs.

To complete this test I learnt:
- **Node.js Fundamentals**
- **How to develop APIs**
- **How to use the Express framework**
- **HTTP Methods in the context of APIs**
- **Front-End Integration**

And I improved my knowledge of:
- **JavaScript**
- **Error Handling**
- **Working with JSON**

## How to Run
1. Clone repository: ```git clone https://github.com/Ben-Legg/Dizplai-Assignment.git```
2. Enter git folder: ```cd Dizplai-Assignment```
3. Install dependencies: ```npm install```
4. Run server: ```node app```
5. Open browser and go to: ```localhost:3000/```
6. Interact with app!

## Assumptions made
- The app only needs to be run locally.
- I did not have to implement a method for creating polls.
- I was tasked with using the provided assets and attributes to replicate the example provided in the test documentation.
- Storing poll data in JSON files is an acceptable method of local permanent data storage.

## Remaining Issues
- EJS in HTML style tag casuing syntax error in VS Code (results.ejs line 36).
- Current use of HTML buttons does not allow background to stay transparent while also implementing vote% visual on results page.