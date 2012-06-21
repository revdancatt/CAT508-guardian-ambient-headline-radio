import json
import urllib2
import cStringIO
import base64
import webapp2


class MainPage(webapp2.RequestHandler):
    def get(self):

        f = urllib2.urlopen(urllib2.unquote('http://static.guim.co.uk/sys-images/%s') % self.request.get('img'))
        im = cStringIO.StringIO(f.read())
        return_image = base64.b64encode(im.getvalue())
        type_prefix = "data:image/jpg;base64,"
        data = {
                            "data": type_prefix + return_image
                        }

        self.response.headers['Content-Type'] = 'application/json'
        if 'callback' in self.request.arguments():
                data = '%s(%s)' % (self.request.get('callback'), json.dumps(data))
                self.response.out.write(data)
        else:
                self.response.out.write(json.dumps(data))


app = webapp2.WSGIApplication([('/img_to_json', MainPage)], debug=True)
