import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies["access_token"];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super(
      {
        ignoreExpiration: false,
        secretOrKey: jwtConstants.secret,
        jwtFromRequest: extractJwtFromCookie
      }
    );
  }

  async validate(payload: any) {
    return { userId: payload.id, username: payload.email, roleId: payload.roleId };
  }
}
