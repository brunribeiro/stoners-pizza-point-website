import { withSessionRoute } from '../../lib/withSession';

async function updateToken(request, response) {
  request.session.token = request.body.token;
  await request.session.save();
  response.send({ ok: true, ...request.session });
}

export default withSessionRoute(updateToken);
