import { StaffRepository } from "../repositories/staff.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export class AuthService {
  private staffRepository: StaffRepository;

  constructor() {
    this.staffRepository = new StaffRepository();
  }
  async login(email: string, password: string): Promise<string | null> {
    const staff = await this.staffRepository.findByEmail(email);
    if (!staff) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, staff.password_hash);
    if (!isMatch) {
      return null;
    }
    const token = jwt.sign(
      { id: staff.id, email: staff.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" },
    );

    return token;
  }
}
