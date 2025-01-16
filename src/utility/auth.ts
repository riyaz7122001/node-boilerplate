import { JWT_SECRET } from '../setup/secrets';
import { userRoles } from '../types/utility';
import { compare, hash } from 'bcrypt'
import { randomBytes } from 'crypto';
import { JwtPayload, sign, verify } from 'jsonwebtoken';


const validatePassword = async (password: string, passwordHash: string): Promise<boolean> => {
    return await compare(password, passwordHash);
}

const generateRefreshToken = (size: number) => {
    return new Promise<string>((resolve, reject) => {
        randomBytes(size, (err, buf) => {
            if (err) {
                reject(err)
            }
            resolve(buf.toString('hex'))
        });
    });
}


const generateJWTToken = (userId: string, email: string, claim: userRoles, sessionId?: string | null) => {
    const data = {
        id: userId,
        email: email,
        claim,
        sessionId
    }

    return new Promise<string>((resolve, reject) => {
        sign(data, JWT_SECRET!, {
            expiresIn: '1d'
        }, (err, token) => {
            if (err) {
                reject(err)
            }
            if (token) {
                resolve(token)
            }
            reject(`Token generation failed`)
        })
    })
}

const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
}

const decodeToken = (token: string) => {
    if (!token) {
        throw new Error('Missing token');
    }
    return new Promise<JwtPayload>((resolve, reject) => {
        verify(token, JWT_SECRET!, (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve(decoded as JwtPayload);
        });
    });
}

export { validatePassword, generateRefreshToken, generateJWTToken, hashPassword, decodeToken }