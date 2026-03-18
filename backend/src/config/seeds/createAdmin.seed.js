const User = require('../../models/users/user.model');
const UserGroup = require('../../models/users/user.groups.model');

/**
 * Cria um usuário administrador padrão se nenhum usuário existir no banco.
 */
async function createDefaultAdminUser() {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('Nenhum usuário encontrado. Criando usuário administrador padrão...');

      if (!process.env.ADMIN_DEFAULT_PASSWORD || !process.env.ADMIN_DEFAULT_USERNAME || !process.env.ADMIN_DEFAULT_EMAIL) {
          console.error('Variáveis de ambiente para o admin padrão (ADMIN_DEFAULT_PASSWORD, ADMIN_DEFAULT_USERNAME, ADMIN_DEFAULT_EMAIL) não estão definidas.');
          return;
      }

      const adminUser = await User.create({
        username: process.env.ADMIN_DEFAULT_USERNAME,
        email: process.env.ADMIN_DEFAULT_EMAIL,
        password: process.env.ADMIN_DEFAULT_PASSWORD,
      });

      await UserGroup.findOrCreate({
        where: { userId: adminUser.id, groupId: 1 },
      });

      console.log('Usuário administrador padrão criado com sucesso.');
    }
  } catch (error) {
    console.error('Falha ao criar usuário administrador padrão:', error);
  }
}

module.exports = createDefaultAdminUser;