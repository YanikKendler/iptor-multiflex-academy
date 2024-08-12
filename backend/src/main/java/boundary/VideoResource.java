package boundary;

import dtos.VideoOverviewDTO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import model.Video;
import org.jboss.resteasy.reactive.RestResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repository.VideoRepository;

import java.io.File;
import java.io.InputStream;
import java.util.List;

@Path("video")
public class VideoResource {
    private static final Logger log = LoggerFactory.getLogger(VideoResource.class);
    @Inject
    VideoRepository repository;

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/upload")
    public Response upload(@FormParam("file") InputStream uploadedInputStream) {
        try {
            repository.uploadVideo(uploadedInputStream);

            return Response.ok().entity("{\"message\":\"File uploaded successfully\"}").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity(e).build();
        }
    }

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
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(videos).build();
    }

    @GET
    @Path("{id: [0-9]+}")
    public Response getVideo(@PathParam("id") Long id){
        System.out.println("getVideo");
        Video video;
        try{
            video = repository.getById(id);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(video).build();
    }

    @GET
    @Produces(MediaType.MULTIPART_FORM_DATA)
    @Path("{videoId:[0-9]+}/getVideoChunk/{fileName}")
    public RestResponse<File> getVideoChunk(@PathParam("fileName") String fileName, @PathParam("videoId") Long videoId) {
        try {
            File file = repository.getVideoChunk(videoId, fileName);
            return RestResponse.ResponseBuilder.ok(file)
                    .header("Content-Disposition", "attachment; filename=\""+ fileName +"\"")
                    .build();
        }
        catch (NullPointerException e){
            //return RestResponse.ResponseBuilder.notFound().build();
            return null;
        }
        catch (Exception e){
            e.printStackTrace();
            //return RestResponse.ResponseBuilder.serverError().build();
            return null;
        }
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

    @PUT
    @Path("{videoId: [0-9]+}/linkVideoFile/{fileId: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response linkVideoFile(@PathParam("videoId") Long videoId, @PathParam("fileId") Long fileId){
        try{
            repository.linkVideoFile(videoId, fileId);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
