const scrypt = require('scrypt');

export class Utils {

  private static scryptParameters = scrypt.paramsSync(0.1);

  static async hashString(s: string): Promise<string> {
    const kdfResult = await scrypt.kdf(s, this.scryptParameters);
    return kdfResult.toString('base64');
  }

  static async verifyHash(hash: string, candidate: string): Promise<boolean> {
    return scrypt.verifyKdf(Buffer.from(hash, 'base64'), candidate);
  }
}
