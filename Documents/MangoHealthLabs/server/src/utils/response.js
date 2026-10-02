export function success(res, message, data = {}, status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function failure(res, message, errors = [], status = 400) {
  return res.status(status).json({ success: false, message, errors });
}
