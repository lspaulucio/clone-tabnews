function status(request, response) {
  response.status(200).json({ message: "Test status endpoint" });
}

export default status;
