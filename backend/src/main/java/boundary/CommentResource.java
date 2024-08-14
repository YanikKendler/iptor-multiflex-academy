package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Comment;
import repository.CommentRepository;
import java.util.List;

@Path("/video/{videoId: [0-9]+}/comment")
public class CommentResource {
    @Inject
    CommentRepository repository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createComment(@PathParam("videoId") Long vid, Comment c){
        try {
            repository.create(vid, c);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("videoId") Long vid, @QueryParam("userId") Long uid){
        List<Comment> comments;
        try{
            System.out.println(uid);
            comments = repository.getAll(vid, uid);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(comments).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteComment(@PathParam("id") Long id){
        try{
            repository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{id: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateComment(@PathParam("id") Long id, Comment c){
        try{
            repository.update(c);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
