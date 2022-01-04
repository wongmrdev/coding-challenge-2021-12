# Getting Started with this assignment

The app can be accessed [here](https://main.dhuyh5ziste2s.amplifyapp.com/)

I've added two routes for this app, one for data search and one for data ingestion
Included in this app is a ReactJS Front End which a user can directly upload files or copy paste DNA Sequence JSON into the browser.
On the search page, users can enter their ATCG sequence and return DNA Sequences that are matching. From there, they can delete the displayed matching sequences to remove them permanently.
There is a GraphQL API endpoint powered by AWS Appsync where users can use a Graphiql interface to submit. Currently all users can perform all CRUD operations on this endpoint.
There is a DynamoDB Table supporting the data persistence layer.
The App is deployed on the AWS Global Cloudfront CDN from an S3 Bucket.

# Considerations for the future:

1. Fetch Data From An Benchling API
2. More Data Sanitation (On Creators)
3. Documentation For API
4. Authentication And Authorization and Roles
5. Delete Confirmation
6. Testing Suite (Jest)
7. Integrate Backend With Hasura PostgreSQL
8. Add Memoization And Query Cache
9. Remove Creators Only When All Their DNA Sequences Are Removed
10. Add Data Streams To Other Applications
11. Paginations/Lazy Loading has been added to the URI /lazy

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

# Thoughts on other extensions

● UI/UX and design: How might you create an intuitive interface that helps scientists
realize deep understandings of genomic data?

You may add a option to upload unmarked genomic data. Afterwards, you can apply your known DNA sequences to mark which sequences are present in the unknown sample.

In your search, you may also want to add the ability to allow for mismatch sequences (insertions, deletions, shifts, replacements, etc).

Some other features could be to have users save their favorite sequences, share their favorite sequences (socially and to other applicaitons), export their favorite sequences, annotate sequences.

● Adaptability: How might it be possible to evolve your solution so that it could, for
example, search by an arbitrary field or return a subset of data rather than the whole
object?

With a graphql schema, it's easy to set up a dynamic query option for searching DNA sequences. You could have a tick box for fields you want returned. You could also set up an elastic search to search all fields and return only fields with matching information. For
