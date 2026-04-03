const app = require('./app');
const { sequelize, connectWithRetry } = require('./src/config/db');
const setupAssociations = require('./src/models/associations.model');
const defaultGroupsSeed = require('./src/config/seeds/default.groups.seed');
const createDefaultAdminUser = require('./src/config/seeds/createAdmin.seed');
const createDefaultStudentUser = require('./src/config/seeds/createStudent.seed');
const PORT = process.env.PORT || 3000;

const swaggerUi = require('swagger-ui-express');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./src/config/swagger')));


async function startServer() {
  try {
    setupAssociations();
    await connectWithRetry(10, 3000);
    // await sequelize.sync({ force: true });
    await sequelize.sync({ alter: true });
    
    // Run seeders after database is synced
    await defaultGroupsSeed();
    await createDefaultAdminUser();
    await createDefaultStudentUser();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
      console.log(`PhpMyAdmin available at http://localhost:8080`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();