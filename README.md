# Getting Started with this assignment

The app can be accessed [here](https://main.dhuyh5ziste2s.amplifyapp.com/)

I've added two routes for this app, one for data search and one for data ingestion
Included in this app is a React Front End which a user can directly upload files or copy paste DNA Sequence JSON into the browser. There is a GraphQL API endpoint powered by AWS Appsync where users can use a Graphiql interface to submit.
There is a DynamoDB Table supporting the data persistence layer.
The App is deployed on the AWS Global CDN.

# Considerations for the future:

1. Paginations/Lazy Loading
2. More Sanitation (on creators)
3. Documentation for API
4. Authentication and Authorization and roles
5. Delete Confirmation
6. Testing Suite (Jest)
7. Integrate backend with Hasura PostgreSQL
8. Add memoization and Query Cache
9. Remove creators only when all their DNA Sequences are removed
10. Add data streams to other applications

# Thoughts

I decided to push the technical sophistication of your solution along the
dimension:
● Performance and scalability: Design your service to scale to significantly larger and
more complex datasets. How does your design handle issues such as consistency,
latency and staleness?

The solution is deployed in a serverless environment to improve scalability.
A dynamoDB persistence layer is highly scalable and highly available.
A graphql Schema is flexible to accommodate changes to the data model.
The app is also deployed on a CDN to minimize latency to end users.
A DAX and AWS Global Accelerator could also increase query speed for replicated queries over the caching window.
We can add a cache in front of our API to speed it up https://aws.amazon.com/appsync/pricing/

A notes: what's the shortest length a scientist would search? 3bp for a single codon? seems small but it can be adjusted.
