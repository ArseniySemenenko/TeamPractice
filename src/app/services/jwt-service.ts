import { Service } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

@Service()
export class JwtService {
    decodeToken(token: string): JwtPayload | null{
        try {
            return jwtDecode<JwtPayload>(token);
        } catch {
            return null;
        }
    }   

    getTokenExpiry(token: string): number | null{
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) return null;
        console.log('token exp: ' , String(new Date(decoded.exp * 1000)));
        return Number(new Date(decoded.exp * 1000));
    }
}
