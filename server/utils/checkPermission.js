import { UnauthonticatedError } from "../errors/index.js";

const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthonticatedError('Not authorized to access this route')
}

export default checkPermission;