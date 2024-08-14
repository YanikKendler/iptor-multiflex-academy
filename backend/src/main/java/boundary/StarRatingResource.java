package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Comment;
import model.StarRating;
import repository.CommentRepository;
import repository.StarRatingRepository;

import java.util.List;

@Path("/video/{videoId: [0-9]+}/starrating")
public class StarRatingResource {
    @Inject
    StarRatingRepository repository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setRating(double rating, @PathParam("videoId") Long vid, @QueryParam("userId") Long uid){
        try {
            repository.set(vid, uid, rating);
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRating(@PathParam("videoId") Long vid, @QueryParam("userId") Long uid){
        try{
            return Response.ok().entity(repository.getRating(vid, uid)).build();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteRating(@PathParam("id") Long id){
        try{
            repository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/average")
    public Response getAverage(@PathParam("videoId") Long vid){
        try{
            return Response.ok().entity(repository.getAverage(vid)).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }
}
