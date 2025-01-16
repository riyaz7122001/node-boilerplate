import roles from "../models/role";
import user from "../models/user";
import { hashPassword } from "../utility/auth";

const createAdmin = async (firstName: string, lastName: string, phone: string, email: string, password: string) => {
  const hash = await hashPassword(password);
  const role = await roles.findOne({
    where: {
      role: 'admin'
    }
  });
  if (!role) {
    throw new Error('No role found: superadmin');
  }

  await user.create({
    firstName,
    lastName,
    phone,
    email,
    passwordHash: hash,
    createdOn: new Date(),
    passwordSetOn: new Date(),
    activationStatus: true,
    isDeleted: false,
    roleId: role.id,
  });
};

createAdmin("Riyaz", "Shaikh", "8169036093", "riyazshaikh7122001@gmail.com", "Admin@1234")
  .then(() => {
    console.log("Admin created successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error while creating super admin");
    console.error(error);
    process.exit(1);
  });
