const page = async (request, reply) => {
  reply.view('src/templates/index.ejs', {
    page: {
      title: 'App',
      description: 'This is an app',
    },
  });
};

module.exports = page;
