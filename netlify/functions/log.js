exports.handler = async (event) => {
  console.log("Log event:", event.body);
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "logged" })
  };
};