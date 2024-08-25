import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path'
import jwt from 'jsonwebtoken'
import User from '../../database/models/user.js'
import Profile from '../../database/models/profiles.js'
import fs from 'fs/promises';
import bcrypt from 'bcrypt';

function CreateId() {
    return uuidv4();
}

async function getUser(req, res, next) {
  if (!req.headers["authorization"]) {
    return res.status(401).end();
  }

  let token = req.headers["authorization"].replace("bearer ", "");
  let decodedToken = jwt.decode(token);

  if (decodedToken) {
    req.user = await User.findOne({ email: decodedToken.email });
    if (!bcrypt.compare(decodedToken.password, req.user.password))
      return res.status(403).end();
  }
  next();
}

function createError(
    errorCode,
    errorMessage,
    messageVars,
    numericErrorCode,
    error,
    statusCode,
    res
  ) {
    console.log(errorCode);
    if (res) {
      res.set({
        "X-Epic-Error-Name": errorCode,
        "X-Epic-Error-Code": numericErrorCode,
      });
  
      res.status(statusCode).json({
        errorCode: errorCode,
        errorMessage: errorMessage,
        messageVars: messageVars,
        numericErrorCode: numericErrorCode,
        originatingService: "any",
        intent: "prod",
        error_description: errorMessage,
        error: error,
      });
    } else {
      console.error("Response object 'res' is undefined.");
    }
  }

function getVersion(req) {
    let ver = { season: 0, build: 0.0, CL: "0", lobby: "" };
  
    if (req && req.headers && req.headers["user-agent"]) {
      let CL = "";
      let userAgentParts = req.headers["user-agent"].split("-");
      CL = userAgentParts[userAgentParts.length - 1].split(" ")[0].split(",")[0];
  
      let buildIndex = req.headers["user-agent"].indexOf("Release-");
      if (buildIndex !== -1) {
        let build = req.headers["user-agent"]
          .substring(buildIndex + 8)
          .split("-")[0];
        let buildP = build.split(".");
        ver.season = parseInt(buildP[0]);
        ver.build = parseFloat(`${buildP[0]}.${buildP[1]}${buildP[2]}`);
        ver.CL = CL;
        ver.lobby = `LobbySeason${ver.season}`;
      }
    }
    return ver;
  }

async function createProfiles(accountId) {
    let profiles = {};

    const currentFileUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentFileUrl);
    const currentDirPath = dirname(currentFilePath);
    const profilesDirectory = join(currentDirPath, '..', '..', "local", "handlers", "profiles");

    try {
        const files = await fs.readdir(profilesDirectory);

        await Promise.all(
            files.map(async (fileName) => {
                const filePath = join(profilesDirectory, fileName);

                try {
                    const data = await fs.readFile(filePath, 'utf8');
                    const profile = JSON.parse(data);

                    profile.accountId = accountId;
                    profile.created = new Date().toISOString();
                    profile.updated = new Date().toISOString();

                    profiles[profile.profileId] = profile;
                } catch (error) {
                    console.error("Error reading profile:", error);
                }
            })
        );

        return profiles;
    } catch (error) {
        console.error("Error reading profiles directory:", error);
        throw error;
    }
}

async function registerUser(displayName, email, dehashedPassword) {
    const accountId = CreateId();

    if (typeof dehashedPassword !== 'string') {
        console.error("Invalid password provided");
        return { message: "Invalid password provided", status: 400 };
    }

    try {
        const hashedPassword = await bcrypt.hash(dehashedPassword, 10);

        const userProfile = await createProfiles(accountId);
        const user = await User.create({
            accountId,
            displayName,
            email,
            password: hashedPassword,
            created: new Date(),
        });

        await Profile.create({
            accountId: user.accountId,
            profiles: userProfile,
            created: new Date().toISOString(),
            access_token: "",
            refresh_token: "",
        });

        return {
            message: "Your account has been successfully created",
            status: 200,
        };
    } catch (error) {
        console.error("Error creating account:", error);
        return { message: "An error has occurred", status: 400 };
    }
}

function decode64(str) {
    return Buffer.from(str, "base64").toString();
}


export { CreateId, registerUser, createProfiles, decode64, getVersion, createError, getUser };
