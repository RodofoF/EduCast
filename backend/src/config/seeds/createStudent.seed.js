const User = require('../../models/users/user.model');
const UserGroup = require('../../models/users/user.groups.model');

/**
 * Cria (ou garante) o usuário estudante padrão.
 */
async function createDefaultStudentUser() {
  try {
    const email = process.env.STUDENT_DEFAULT_EMAIL;
    const username = process.env.STUDENT_DEFAULT_USERNAME;
    const password = process.env.STUDENT_DEFAULT_PASSWORD;

    if (!email || !username || !password) {
      console.error('Variáveis de ambiente para o estudante padrão (STUDENT_DEFAULT_PASSWORD, STUDENT_DEFAULT_USERNAME, STUDENT_DEFAULT_EMAIL) não estão definidas.');
      return;
    }

    const [studentUser, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        username,
        email,
        password,
      },
    });

    // Mantém os dados alinhados para ambiente de teste/dev.
    if (!created) {
      await studentUser.update({ username, password });
    }

    // Garante vínculo como aluno (grupo 3)
    await UserGroup.findOrCreate({
      where: { userId: studentUser.id, groupId: 3 },
    });

    // Opcional: remove vínculo antigo de admin caso exista por seed anterior
    await UserGroup.destroy({
      where: { userId: studentUser.id, groupId: 1 },
    });

    console.log('Usuário estudante padrão garantido com sucesso.');
  } catch (error) {
    console.error('Falha ao criar usuário estudante padrão:', error);
  }
}

module.exports = createDefaultStudentUser;