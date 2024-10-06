document.addEventListener('DOMContentLoaded', () => { // Class graph
    const width = document.getElementById('graph').clientWidth;
    const height = document.getElementById('graph').clientHeight;

    const svg = d3.select('#graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Define a single-direction arrowhead marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 10)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .attr('fill', '#343a40')
        .style('stroke', 'none');

    // Define zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])  // Minimum and maximum zoom levels
        .on('zoom', zoomed);
    svg.call(zoom);

    // Create a group element to contain all graph elements
    const g = svg.append('g');

    // Define the zoomed function
    function zoomed(event) {
        g.attr('transform', event.transform);
    }

    // Load color coding for prefixes
    const prefixColors = {
        "ACCT": "#87CEFA", // Light Sky Blue
        "ANTH": "#c2c5c5",  // Light Grey
        "ART": "#c2c5c5",  // Light Grey
        "AUTO": "#7f8282",  // Dark Grey
        "AVIA": "#c2c5c5",  // Light Grey
        "BIOL": "#98FB98",  // Pale Green
        "CDEV": "#c2c5c5",  // Light Grey
        "CHEM": "#32CD32",  // Lime Green
        "CIS": "#00BFFF",  // Sky Blue
        "COMM": "#E9967A",  // Dark Salmon
        "CORR": "#c2c5c5",  // Light Grey
        "CPTR": "#B8860B",  // Goldenrod
        "CYBS": "#B8860B",  // Dark Goldenrod
        "DRMA": "#FF6347",  // Tomato
        "DSGN": "#c2c5c5",  // Light Grey
        "ECON": "#1E90FF",  // Dodger Blue
        "EDUC": "#c2c5c5",  // Light Grey
        "ENGL": "#663399",  // Rebecca Purple
        "ENGR": "#FF6700",  // Vivid Orange
        "ENVI": "#FFD580",  // Light Orange
        "FILM": "#c2c5c5",  // Light Grey
        "FINA": "#4169E1",  // Royal Blue
        "FLTV": "#FF0000",  // Red
        "FREN": "#7054a8",  // Medium Purple
        "GBUS": "#0000CD",  // Medium Blue
        "GCDP": "#c2c5c5",  // Light Grey
        "GDEV": "#edb937",  // Light Goldenrod
        "GEOG": "#c2c5c5",  // Light Grey
        "GNRL": "#c2c5c5",  // Light Grey
        "GREK": "#c2c5c5",  // Light Grey
        "GRMN": "#c2c5c5",  // Light Grey
        "GRPH": "#c2c5c5",  // Light Grey
        "HEBR": "#c2c5c5",  // Light Grey
        "HIST": "#c2c5c5",  // Light Grey
        "HLTH": "#c2c5c5",  // Light Grey
        "HMNT": "#c2c5c5",  // Light Grey
        "HONR": "#c2c5c5",  // Light Grey
        "ILL": "#c2c5c5",  // Light Grey
        "JOUR": "#B22222",  // Firebrick
        "LANG": "#663399",  // Rebecca Purple
        "LATN": "#c2c5c5",  // Light Grey
        "LAW": "#c2c5c5",  // Light Grey
        "MATH": "#808000",  // Olive
        "MDEV": "#a6a602",  // Light Olive
        "MEDU": "#c2c5c5",  // Light Grey
        "MGMT": "#00008B",  // Dark Blue
        "MKTG": "#000080",  // Navy Blue
        "MUCT": "#c2c5c5",  // Light Grey
        "MUED": "#c2c5c5",  // Light Grey
        "MUHL": "#c2c5c5",  // Light Grey
        "MUPF": "#c2c5c5",  // Light Grey
        "NRSG": "#c2c5c5",  // Light Grey
        "PEAC": "#c2c5c5",  // Light Grey
        "PETH": "#c2c5c5",  // Light Grey
        "PHIL": "#c2c5c5",  // Light Grey
        "PHTO": "#c2c5c5",  // Light Grey
        "PHYS": "#228B22",  // Forest Green
        "PLSC": "#c2c5c5",  // Light Grey
        "PRDN": "#c2c5c5",  // Light Grey
        "PREL": "#8B0000",  // Dark Red
        "PSYC": "#c2c5c5",  // Light Grey
        "RDNG": "#c2c5c5",  // Light Grey
        "RELB": "#c2c5c5",  // Light Grey
        "RELH": "#c2c5c5",  // Light Grey
        "RELM": "#c2c5c5",  // Light Grey
        "RELP": "#c2c5c5",  // Light Grey
        "RELT": "#c2c5c5",  // Light Grey
        "SCDI": "#98FF98",  // Mint Green
        "SERV": "#c2c5c5",  // Light Grey
        "SMTF": "#c2c5c5",  // Light Grey
        "SOCI": "#c2c5c5",  // Light Grey
        "SOWK": "#c2c5c5",  // Light Grey
        "SPAN": "#9370DB",  // Medium Purple
        "SPCH": "#FA8072",  // Salmon
        "SPED": "#c2c5c5",  // Light Grey
        "SPPA": "#FA8072",  // Salmon
        "TECH": "#c2c5c5",  // Light Grey
        "WRIT": "#663399",  // Rebecca Purple
    };

    d3.json('data.json').then(data => {
        console.log('Data loaded:', data);  // Debug: Check loaded data

        // Transform the course data into nodes and links
        const nodes = data.courses.map(course => ({
            id: course.id,
            name: course.name,
            prefix: course.id.split(' ')[0]  // Extract prefix from ID
        }));

        const links = [];
        data.courses.forEach(course => {
            course.prerequisites.forEach(prereq => {
                if (nodes.find(n => n.id === prereq)) {  // Ensure prerequisite exists
                    links.push({ source: prereq, target: course.id, type: 'prerequisite' });
                }
            });
            course.corequisites.forEach(coreq => {
                if (nodes.find(n => n.id === coreq)) {  // Ensure corequisite exists
                    links.push({ source: coreq, target: course.id, type: 'corequisite' });
                }
            });
        });

        // Set up the D3 force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-500))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('x', d3.forceX(d => {
                // if (d.prefix === 'MATH' || d.prefix === 'PHYS') return width * 0.25;  // Left side
                // if (d.prefix === 'CHEM' || d.prefix === 'BIOL') return width * 0.75;  // Right side
                return width / 2;  // Center for other prefixes
            }).strength(0.1))
            .force('y', d3.forceY(d => {
                if (d.prefix === 'AUTO') return height * 0.25;  // Top side
                // if (d.prefix === 'PHYS' || d.prefix === 'BIOL') return height * 0.75;  // Bottom side
                return height / 2;  // Center for other prefixes
            }).strength(0.1));


        // Add links (arrows) first to ensure they are below nodes
        const link = g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('class', d => `link ${d.type}`)
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead)'); // Use single arrowhead for both types

        // Add nodes last to ensure they are on top of links
        const node = g.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        node.append('rect')
            .attr('width', 60)
            .attr('height', 30)
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('x', -30)
            .attr('y', -15)
            .attr('class', 'node-rect')
            .attr('fill', d => {
                const color = prefixColors[d.prefix];
                console.log(`Node ID: ${d.id}, Prefix: ${d.prefix}, Color: ${color}`); // Debug: Check color assignment
                return color || '#ccc';  // Default to gray if prefix is not found
            });

        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .text(d => d.id);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            // Extend links a bit beyond the node edges
            link.each(function(d) {
                const linkElement = d3.select(this);
                const x1 = d.source.x;
                const y1 = d.source.y;
                const x2 = d.target.x;
                const y2 = d.target.y;
                const dx = x2 - x1;
                const dy = y2 - y1;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const padding = 20;

                linkElement.attr('x1', x1 + (padding * dx / dist))
                    .attr('y1', y1 + (padding * dy / dist))
                    .attr('x2', x2 - (padding * dx / dist))
                    .attr('y2', y2 - (padding * dy / dist));
            });

            node
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }).catch(error => console.error('Error loading data:', error));
});