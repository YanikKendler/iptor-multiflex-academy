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
    public Response createDevice(@PathParam("videoId") Long vid, Comment c){
        try {
            repository.create(vid, c);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("videoId") Long vid){
        List<Comment> comments;
        try{
            comments = repository.getAll(vid);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(comments).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteDevice(@PathParam("id") Long id){
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
    public Response updateDevice(@PathParam("id") Long id, Comment c){
        try{
            repository.update(c);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
