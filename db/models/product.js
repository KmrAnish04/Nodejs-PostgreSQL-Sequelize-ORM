const sequelize = require('../../config/database.js');
const {
  DataTypes
} = require('sequelize');
const AppError = require('../../utils/appError.js');

module.exports = sequelize.define('product', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'title cannot be null!'
      },
      notEmpty: {
        msg: 'title cannot be empty!'
      }
    }
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    validate: {
      isIn: {
        args: [
          [true, false]
        ],
        msg: 'isFeatured value must be true or false!'
      }
    }
  },
  productImage: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      notNull: { msg: 'Product Image cannot be null!'}
    },
    isArrayOfURLs(value) {
      if(!Array.isArray(value)){
        throw new AppError('Product Image must be an array!');
      }
      for (const url of value) {
        if (!/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(url)) {
          throw new Error('Each Product Image must be a valid URL!');
        }
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Price cannot be null!'
      },
      notEmpty: {
        msg: 'Price cannot be empty!'
      }
    }
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'shortDescription cannot be null',
      },
      notEmpty: {
        msg: 'shortDescription cannot be empty',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {msg: 'description cannot be null'},
      notEmpty: {msg: 'description cannot be empty'},
    },
  },
  productUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {msg: 'productUrl cannot be null'},
      notEmpty: {msg: 'productUrl cannot be empty'},
      isUrl: {msg: 'Invalid productUrl string'},
    },
  },
  category: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'category cannot be null',
      },
    },
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'tags cannot be null',
      },
    },
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'product'
});