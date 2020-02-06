import  Sequelize from 'sequelize'
import  connection from '../../config/sequelize'

const Email = connection.define('email', 
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
		},
		email: {
            type: Sequelize.STRING,
            isEmail: true,
            isUnique: true,
            allowNull: false
        },
		name: Sequelize.STRING,
		facility_code: Sequelize.STRING,
		facility_name: Sequelize.STRING,
		isActive: Sequelize.BOOLEAN,
        description: Sequelize.TEXT,
        category: Sequelize.STRING
    }, 
    { freezeTableName: true }
)

connection.sync()
module.exports = Email