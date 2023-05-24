import Boom from "@hapi/boom";
import Hapi from "@hapi/hapi";
import Joi from "joi";

const userInputValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  social: Joi.object({
    facebook: Joi.string().optional(),
    twitter: Joi.string().optional(),
    github: Joi.string().optional(),
    website: Joi.string().optional(),
  }).optional(),
});

const usersPlugin: Hapi.Plugin<null> = {
  name: "app/users",
  dependencies: ["prisma"],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: "POST",
        path: "/users",
        handler: createUserHandler,
        options: {
          validate: {
            payload: userInputValidator
          }
        }
      },
      {
        method: "GET",
        path: "/users/{userId}",
        handler: getUserHandler,
        options: {
          validate: {
            params: Joi.object({
              userId: Joi.number().integer()
            })
          }
        }
      },
      {
        method: "DELETE",
        path: "/users/{userId}",
        handler: deleteUserHandler,
        options: {
          validate: {
            params: Joi.object({
              userId: Joi.number().integer()
            })
          }
        }
      }
    ]);
  },
};

export default usersPlugin;

interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  social: {
    facebook?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}



async function createUserHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const {prisma} = request.server.app;
  const payload = request.payload as UserInput;

  try {
    const createdUser = await prisma.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        social: JSON.stringify(payload.social),
      },
      select: {
        id: true,
      },
    });

    return h.response(createdUser).code(201);
  } catch (error) {
    console.error(error);
  }
}

async function getUserHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const {prisma} = request.server.app
  const userId = parseInt(request.params.userId, 10)

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      return h.response().code(404)
    }else {
      return h.response(user).code(200)
    }
  } catch (error) {
    console.error(error)

    return Boom.badImplementation()
  }
}

async function deleteUserHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const {prisma} = request.server.app
  const userId =  parseInt(request.params.userId, 10)

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })
    return h.response().code(204)
  } catch (err) {
    console.log(err)
    return h.response().code(500)
  }
}