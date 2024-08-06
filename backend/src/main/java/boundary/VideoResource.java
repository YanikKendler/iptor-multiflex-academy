package boundary;

import dtos.VideoOverviewDTO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Video;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repository.VideoRepository;

import java.util.List;

@Path("video")
public class VideoResource {
    private static final Logger log = LoggerFactory.getLogger(VideoResource.class);
    @Inject
    VideoRepository repository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createVideo(Video v){
        try {
            repository.create(v);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(){
        List<VideoOverviewDTO> videos;
        try{
            videos = repository.getAll();
            System.out.println(videos);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(videos).build();
    }

    @GET
    @Path("{id: [0-9]+}")
    public Response getVideo(@PathParam("id") Long id){
        Video video;
        try{
            video = repository.getById(id);
            System.out.println(video.toString());
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(video).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteVideo(@PathParam("id") Long id){
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
    public Response updateVideo(@PathParam("id") Long id, Video v){
        try{
            repository.update(v);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
