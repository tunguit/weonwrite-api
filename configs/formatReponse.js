module.exports = (status, message, data) => {
  const standard = {
    success: status,
    message: message,
    data: data
  };

  return standard;
}