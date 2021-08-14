const util = require("util");
const stream = require("stream");

const request = require("request");
const ndjson = require("ndjson");
const filter = require("through2-filter");

const through2 = require("through2");
const sentiment = require("sentiment");

const pipeline = util.promisify(stream.pipeline);

(async () => {
  //   const client = new MongoClient(process.env["ATLAS_URI"], {
  //     useUnifiedTopology: true,
  //   });

  // optional sentiment analyzing of the text
  const textRank = new sentiment();

  const FILTER_TEXT = "bitcoin";

  try {
    // await client.connect();
    // const collection = client.db("hacker-news").collection("mentions");

    const result = await pipeline(
      // this is be like a "SSE EventStream" response, e.g the response data will be
      // constantly/continuously be sent/pushed in the response
      request("http://api.hnstream.com/comments/stream/"),

      // just for debugging
      //process.stdout,

      // returns a transform stream that accepts newline delimited json and emits objects
      // if received a stream of text:
      //   {"foo": "bar"}
      //   {"hello": "world"}
      //   invalid
      //   {"hi": "again"}
      // will output a stream with of parsed JSON objects
      // Note: strict=false means to discard non-valid JSON messages
      ndjson.parse({ strict: false }),

      // returns a transform stream with filtered output
      // filter only necessary JSON objects
      filter({ objectMode: true }, (chunk) => {
        // NOTE: chunk will be as per the HackerNews API response
        // e.g {"body", "article-title", "article-id", "author", ...}
        return (
          chunk["body"].toLowerCase().includes(FILTER_TEXT) ||
          chunk["article-title"].toLowerCase().includes(FILTER_TEXT)
        );
      }),

      // analyze the text for "sentiment" (just the body)
      // and attach a "score"
      through2.obj((chunk, enc, next) => {
        let result = textRank.analyze(chunk.body);
        chunk.score = result.score;

        // pass through for further processing of the stream
        next(null, chunk);
      })

      // store items in DB if needed
      //   through2.obj((chunk, enc, next) => {
      //     collection.insertOne({
      //       ...chunk,
      //       "user-url": `https://news.ycombinator.com/user?id=${chunk["author"]}`,
      //       "item-url": `https://news.ycombinator.com/item?id=${chunk["article-id"]}`,
      //     });
      //     next();
      //   }),
    );
    console.log("FINISHED", result);
  } catch (error) {
    console.log(error);
  }
})();
